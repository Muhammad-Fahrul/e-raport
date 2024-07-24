import{e as G,P as y,r as o,j as e,L as E,b as Q,f as z}from"./index-X8ORgRL-.js";import{u as H,a as J,b as K}from"./raportApiSlice-BPb8PdQR.js";import{R as W}from"./RecordDetail-Bqs5y21O.js";const w="/api/columns",X=G.injectEndpoints({endpoints:c=>({addColumn:c.mutation({query:({raportId:r,...n})=>({url:`${w}/${r}`,method:"POST",body:n}),invalidatesTags:[{type:"Column",id:"LIST"},"Raport"]}),deleteColumn:c.mutation({query:({raportId:r,columnId:n})=>({url:`${w}/${r}`,method:"DELETE",body:{columnId:n}}),invalidatesTags:[{type:"Column",id:"LIST"},"Raport"]})})}),{useAddColumnMutation:Y,useDeleteColumnMutation:Z}=X,M=({raportId:c,showModal:r})=>{const[n,i]=o.useState(""),[d,j]=o.useState("string"),[u,f]=o.useState(""),[t,l]=o.useState(""),[N,R]=o.useState([]),[C,{isLoading:V,isError:b,error:a}]=Y(),p=async()=>{var s,v;try{let x={columnName:n,columnType:d};d==="boolean"?(x.trueValue=u,x.falseValue=t):d==="array"&&(x.arrayValues=N);const S=await C({raportId:c,...x});i(""),j("string"),f(""),l(""),R([]),r((s=S==null?void 0:S.data)==null?void 0:s.message,"success")}catch(x){console.log((v=x==null?void 0:x.data)==null?void 0:v.message)}};return o.useEffect(()=>{b&&r(a.data.message||"An error occurred!","error")},[b,r,a]),V?e.jsx(E,{}):e.jsxs("div",{className:"column-input",children:[e.jsxs("div",{children:[e.jsx("input",{type:"text",name:"inputName",id:"inputName",value:n,onChange:s=>i(s.target.value),placeholder:"name",required:!0}),e.jsxs("select",{value:d,name:"inputType",id:"inputType",onChange:s=>j(s.target.value),required:!0,children:[e.jsx("option",{value:"string",children:"Text"}),e.jsx("option",{value:"number",children:"Number"}),e.jsx("option",{value:"boolean",children:"CheckBox"}),e.jsx("option",{value:"array",children:"Tags"})]}),e.jsx("button",{className:"add-new-input",onClick:s=>{s.preventDefault(),n&&p()},children:e.jsx("i",{className:"fa-solid fa-plus"})})]}),d==="boolean"&&e.jsxs("div",{className:"boxArr",children:[e.jsx("input",{type:"text",name:"trueValue",id:"trueValue",value:u,onChange:s=>f(s.target.value),placeholder:"True Value",required:!0}),e.jsx("input",{type:"text",name:"falseValue",id:"falseValue",value:t,onChange:s=>l(s.target.value),placeholder:"False Value",required:!0})]}),d==="array"&&e.jsxs("div",{className:"boxArr",children:[N.map((s,v)=>e.jsx("input",{disabled:!0,value:s},s+v)),e.jsx("input",{type:"text",name:"arrayValues",id:"arrayValues",value:N,onChange:s=>R(s.target.value.split(",")),placeholder:"Array Values (comma separated)",required:!0})]})]})};M.propTypes={raportId:y.string.isRequired,showModal:y.func.isRequired};const D=({columns:c,valid:r,showModal:n,raportId:i})=>{var b;const d=a=>{var s;return(s=[{type:"string",text:"Text"},{type:"number",text:"Number"},{type:"boolean",text:"CheckBox"},{type:"array",text:"Tags"}].find(v=>v.type===a))==null?void 0:s.text},j=a=>a.map(p=>e.jsx("option",{children:p},p)),[u,{isLoading:f,isError:t,error:l}]=Z(),N=async a=>{const p=await u({raportId:i,columnId:a});p.data&&n(p.data.message,"success")};o.useEffect(()=>{t&&n(l.data.message)},[t,n,(b=l==null?void 0:l.data)==null?void 0:b.message]);const R=c.map(a=>{const p=a.columnType==="boolean"?e.jsx("div",{className:"boxArr",children:e.jsxs("select",{children:[e.jsx("option",{children:a.trueValue}),e.jsx("option",{children:a.falseValue})]})}):a.columnType==="array"?e.jsx("div",{className:"boxArr",children:e.jsx("select",{defaultValue:a.columnType,name:"columnType",required:!0,children:j(a.arrayValues)})}):null;return e.jsxs("div",{className:"column-input",children:[e.jsxs("div",{children:[e.jsx("input",{disabled:!0,name:"columnName",type:"text",defaultValue:a.columnName,required:!0}),e.jsx("select",{disabled:!0,defaultValue:a.columnType,name:"columnType",required:!0,children:e.jsx("option",{value:a.columnType,children:d(a.columnType)})}),e.jsx("button",{onClick:s=>{s.preventDefault(),N(a._id)},children:e.jsx("i",{className:"fa-solid fa-trash-can"})})]}),p]},a._id)}),C=!r&&e.jsx(M,{raportId:i,showModal:n});let V;return f&&(V=e.jsx(E,{})),e.jsxs("form",{className:"schema-content",children:[e.jsx("h2",{children:"Schema"}),V,R,C]})};D.propTypes={columns:y.array.isRequired,valid:y.bool.isRequired,showModal:y.func.isRequired,raportId:y.string.isRequired};const U=({columns:c,handleDetail:r})=>{const n=i=>{const d=i.slice(0,3).map((t,l)=>e.jsx("th",{children:t.columnName},t+l)),j=i.length?e.jsx("th",{children:"Info"}):null,u=i.slice(0,3).map((t,l)=>{if(t.columnType==="number")return e.jsx("td",{children:l},t.columnName);if(t.columnType==="string")return e.jsx("td",{children:t.columnName},t.columnName);if(t.columnType==="boolean")return e.jsx("td",{children:"true"},t.columnName)}),f=i.length?e.jsx("td",{children:e.jsx("button",{className:"detail-raport-preview-btn",onClick:()=>r(i),children:e.jsx("i",{className:"fa-solid fa-circle-info"})})}):null;return e.jsxs("table",{className:"table-raport",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[j,d]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[f,u]})})]})};return e.jsxs("div",{className:"container-table-raport",children:[e.jsx("h2",{children:"Preview"}),n(c)]})};U.propTypes={columns:y.array.isRequired,handleDetail:y.func.isRequired};const B=({type:c,message:r})=>e.jsx("div",{className:`modal ${c==="success"?"show success":"show error"}`,children:e.jsx("p",{children:r})});B.propTypes={type:y.string.isRequired,message:y.string.isRequired};const te=()=>{var L;const[c,r]=o.useState(!1),[n,i]=o.useState({}),[d,j]=o.useState(!1),[u,f]=o.useState(null),t=Q(),{raportId:l}=z(),{data:N,isLoading:R,isSuccess:C,isError:V,error:b}=H(l),[a,{isLoading:p,isError:s,error:v}]=J(),[x,{isLoading:S,isSuccess:A}]=K(),q=o.useCallback((m,h)=>{f({message:m,type:h}),j(!0),setTimeout(()=>{j(!1),f(null)},2e3)},[]);o.useEffect(()=>{A&&t("/")},[t,A]),o.useEffect(()=>{s&&q(s||"An error occurred!","error")},[s,q,v]);const P=m=>{const h=m.reduce((T,g)=>{switch(g.columnType){case"number":T[g.columnName]=1;break;case"string":T[g.columnName]="text";break;case"boolean":T[g.columnName]=g.trueValue;break;case"array":T[g.columnName]=g.arrayValues;break}return T},{});i(h),r(!0)},O=async m=>{m.preventDefault();const h=await a(l);h.data&&q(h.data.message,"success")},$=async m=>{m.preventDefault(),confirm("Apakah Anda yakin ingin menghapus buku ini?")&&await x(l)};let k,I;if((p||S)&&(I=e.jsx(E,{})),R)return e.jsx(E,{});if(C){const{columns:m,valid:h}=N,T=e.jsx("button",{disabled:h,className:"validate-btn",onClick:O,children:h?"Validated":"Validate Raport"}),g=e.jsx("button",{className:"delete-btn",onClick:$,children:"Delete Raport"}),F=c&&e.jsx(W,{record:n,setScreen:r,isDemo:!0}),_=d&&e.jsx(B,{type:u==null?void 0:u.type,message:u==null?void 0:u.message});k=e.jsxs("div",{className:"container-raport",children:[F,I,_,e.jsx(D,{columns:m,valid:h,showModal:q,raportId:l}),e.jsxs("div",{className:"raport-btns",children:[T,g]}),e.jsx(U,{columns:m,handleDetail:P})]})}else if(V)return e.jsx("p",{children:(L=b==null?void 0:b.data)==null?void 0:L.message});return k};export{te as default};
