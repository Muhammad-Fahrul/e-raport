import asyncHandler from 'express-async-handler';
import Raport from '../models/raportModel.js';
import Record from '../models/recordModel.js';
import Column from '../models/columnModel.js';

const validateObject = (array, obj) => {
  for (let item of array) {
    if (item.columnType !== 'array') {
      const columnName = item.columnName;
      if (!obj.hasOwnProperty(columnName)) {
        return {
          status: false,
          columnName,
        }; // Jika objek tidak memiliki properti yang sesuai dengan columnName, return false
      }
      if (obj[columnName] !== obj[columnName]) {
        return {
          status: false,
          columnName,
        };
      }
    }
    // Validasi apakah nilai dari properti tersebut sesuai
  }
  return {
    status: true,
  }; // Jika semua validasi terpenuhi, return true
};

const convertAndValidateField = (value, columnType, item) => {
  switch (columnType) {
    case 'string':
      if (typeof value !== 'string') {
        value = String(value);
      }
      if (value.trim() === '') {
        throw new Error(`String value cannot be empty`);
      }
      return value;
    case 'number':
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        throw new Error(`Invalid value for number: ${value}`);
      }
      return numberValue;
    case 'boolean':
      if (value === item.trueValue) {
        return true;
      } else if (value === item.falseValue) {
        return false;
      } else {
        throw new Error(`Invalid value for boolean field: ${value}`);
      }
    case 'array':
      if (!Array.isArray(value)) {
        throw new Error('Invalid value for array type');
      }
      return value;
    default:
      throw new Error(`Unsupported column type: ${columnType}`);
  }
};

const getBooleanRepresentation = async (columnName, raportId) => {
  const column = await Column.findOne({ columnName, raportId });
  if (column && column.columnType === 'boolean') {
    return { trueValue: column.trueValue, falseValue: column.falseValue };
  }
  throw new Error(
    `Column with name ${columnName} not found in raport ${raportId} or is not a boolean type`
  );
};

const sanitizeData = async (mapData, raportId) => {
  const sanitizedObj = {};
  for (const [key, value] of mapData.entries()) {
    try {
      const { trueValue, falseValue } = await getBooleanRepresentation(
        key,
        raportId
      );
      sanitizedObj[key] = value.value ? trueValue : falseValue;
    } catch (error) {
      sanitizedObj[key] = value.value; // Default to original value if not boolean
    }
  }
  return sanitizedObj;
};

const addRecord = asyncHandler(async (req, res) => {
  const { studentId, raportId } = req.params;
  const { raport } = req;
  const { ...data } = req.body;

  const isBodyValid = validateObject(raport.columns, data);

  if (!isBodyValid.status) {
    return res
      .status(400)
      .json({ message: `${isBodyValid.columnName} is required` });
  }

  const fields = new Map();
  for (const item of raport.columns) {
    const value = data[item.columnName];
    if (value !== undefined) {
      try {
        const convertedValue = convertAndValidateField(
          value,
          item.columnType,
          item
        );
        fields.set(item.columnName, {
          value: convertedValue,
          columnType: item.columnType,
        });
      } catch (error) {
        return res.status(400).json({
          message: `Invalid type for field ${item.columnName}: ${error.message}`,
        });
      }
    } else {
      // Do not set value if it is not provided, ensure it is not empty for strings
      if (item.columnType === 'string') {
        return res
          .status(400)
          .json({ message: `Field ${item.columnName} cannot be empty` });
      }
      fields.set(item.columnName, { value: '', columnType: item.columnType });
    }
  }

  const record = new Record({
    studentId,
    raportId,
    fields,
  });

  await record.save();

  res.status(201).json({ data: { record, message: 'Record added' } });
});

const getRecord = asyncHandler(async (req, res) => {
  const { student } = req;
  const { raportId } = req.params;

  const raport = await Raport.findById(raportId).populate('columns');

  if (!raport) {
    return res.status(404).json({ message: 'raport not found' });
  }

  const studentId = student._id;

  const records = await Record.find({ studentId, raportId });

  let sanitizeRecords = records.length
    ? await Promise.all(
        records.map(async (r) => {
          const { fields, ...data } = r._doc;
          return {
            ...data,
            ...(await sanitizeData(fields, raport._id)),
          };
        })
      )
    : [];

  res.json({
    student,
    raport,
    records: sanitizeRecords,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  const record = await Record.findById(recordId).exec();

  if (!record) {
    return res.status(400).json({ message: 'record not found' });
  }

  const raport = await Raport.findById(record.raportId).exec();

  if (!raport || !raport.status) {
    return res.status(400).json({ message: 'student is not found' });
  }

  await record.deleteOne();

  res.json({ message: 'record deleted' });
});

export { addRecord, getRecord, deleteRecord };
