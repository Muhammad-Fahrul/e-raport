import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Record from '../models/recordModel.js';
import Raport from '../models/raportModel.js';
import Column from '../models/columnModel.js';

async function getDynamicFieldCounts(mentorId) {
  // Fetch all boolean columns
  const booleanColumns = await Column.find({ columnType: 'boolean' }).exec();
  const booleanColumnMapping = booleanColumns.reduce((acc, col) => {
    acc[col.columnName] = {
      trueValue: col.trueValue,
      falseValue: col.falseValue,
    };
    return acc;
  }, {});

  // Fetch all records
  const records = await Record.find({}).exec();

  // Fetch all raports and users
  const raports = await Raport.find({ userId: mentorId }).exec();
  const users = await User.find({ mentorId }).exec();

  const processedResults = [];

  records.forEach((record) => {
    const { raportId, studentId, fields } = record;
    const raport = raports.find((r) => r._id.equals(raportId));
    const student = users.find((u) => u._id.equals(studentId));

    if (!raport || !student) return;

    const raportName = raport.name;
    const studentName = student.username;

    fields.forEach((field, fieldKey) => {
      const { columnType, value } = field;

      if (columnType === 'number') {
        const numberColumnName = fieldKey;
        const numberColumnValue = value;

        fields.forEach((field, fieldKey) => {
          const { columnType, value } = field;

          if (columnType === 'boolean' && booleanColumnMapping[fieldKey]) {
            const trueValue = booleanColumnMapping[fieldKey].trueValue;
            const falseValue = booleanColumnMapping[fieldKey].falseValue;

            let existingResult = processedResults.find(
              (res) =>
                res.raportId.equals(raportId) &&
                res.columnName === numberColumnName
            );

            if (!existingResult) {
              existingResult = {
                raportId,
                raportName,
                columnName: numberColumnName,
                columnAnalytics: [],
              };
              processedResults.push(existingResult);
            }

            let existingColumnAnalytics = existingResult.columnAnalytics.find(
              (analytics) => analytics.columnValue === numberColumnValue
            );

            if (!existingColumnAnalytics) {
              existingColumnAnalytics = {
                columnValue: numberColumnValue,
                students: [],
              };
              existingResult.columnAnalytics.push(existingColumnAnalytics);
            }

            let existingStudent = existingColumnAnalytics.students.find((s) =>
              s.studentId.equals(studentId)
            );

            if (!existingStudent) {
              existingStudent = {
                studentId,
                studentName,
                columnStatic: {
                  [trueValue]: 0,
                  [falseValue]: 0,
                },
              };
              existingColumnAnalytics.students.push(existingStudent);
            }

            if (value === true) {
              existingStudent.columnStatic[trueValue] += 1;
            } else if (value === false) {
              existingStudent.columnStatic[falseValue] += 1;
            }
          }
        });
      }
    });
  });

  return processedResults;
}

async function getRecordsByArrayValues(mentorId) {
  // Step 1: Cari student yang dibuat oleh mentor
  const students = await User.find({
    mentorId: mentorId,
  });
  const studentIds = students.map((student) => student._id);
  const studentMap = {};
  students.forEach((student) => {
    studentMap[student._id] = student;
  });

  // Step 2: Cari raport yang dibuat oleh mentor
  const raports = await Raport.find({
    userId: mentorId,
  });

  const raportIds = raports.map((raport) => raport._id);
  const raportMap = {};

  raports.forEach((raport) => {
    raportMap[raport._id] = raport;
  });

  // Step 3: Cari semua record yang sesuai dengan studentId dan raportId
  const records = await Record.find({
    studentId: { $in: studentIds },
    raportId: { $in: raportIds },
  });

  // Step 4: Ambil data column terkait untuk mendapatkan arrayValues
  const columns = await Column.find({
    raportId: { $in: raportIds },
    columnType: 'array',
  });

  // Step 5: Buat peta untuk arrayValues berdasarkan raportId dan columnName
  const arrayValuesMap = {};
  columns.forEach((column) => {
    if (!arrayValuesMap[column.raportId]) {
      arrayValuesMap[column.raportId] = {};
    }
    arrayValuesMap[column.raportId][column.columnName] = column.arrayValues;
  });

  // Step 6: Inisialisasi hasil yang diharapkan
  const result = [];

  // Step 7: Proses records untuk menyusun hasil akhir
  records.forEach((record) => {
    const raportArrayValues = arrayValuesMap[record.raportId];
    if (!raportArrayValues) return;

    // Cek semua field dinamis di dalam record
    record.fields.forEach((value, key) => {
      const fieldValues = value.value;
      const arrayValues = raportArrayValues[key];
      if (!arrayValues || !Array.isArray(fieldValues)) return;

      fieldValues.forEach((val) => {
        if (arrayValues.includes(val)) {
          let columnEntry = result.find(
            (entry) =>
              entry.column.name === key &&
              entry.raport.id.toString() === record.raportId.toString()
          );
          if (!columnEntry) {
            columnEntry = {
              column: {
                name: key,
                type: 'array',
              },
              raport: {
                id: record.raportId,
                name: raportMap[record.raportId]
                  ? raportMap[record.raportId].name
                  : '',
              },
              values: [],
            };
            result.push(columnEntry);
          }

          let valueEntry = columnEntry.values.find(
            (entry) => entry.value === val
          );
          if (!valueEntry) {
            valueEntry = {
              value: val,
              students: [],
            };
            columnEntry.values.push(valueEntry);
          }

          const student = studentMap[record.studentId];
          let studentEntry = valueEntry.students.find(
            (entry) => entry.id.toString() === student._id.toString()
          );
          if (!studentEntry) {
            studentEntry = {
              name: student.username,
              id: student._id,
              total: 0,
            };
            valueEntry.students.push(studentEntry);
          }
          studentEntry.total += 1;
        }
      });
    });
  });

  return result;
}

const getRecordsAnalysisBoelType = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const results = await getDynamicFieldCounts(mentorId);
  res.json({ data: results });
});

const getRecordsAnalysisArrayType = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;
  const results = await getRecordsByArrayValues(mentorId);
  res.json({ data: results });
});

export { getRecordsAnalysisBoelType, getRecordsAnalysisArrayType };
