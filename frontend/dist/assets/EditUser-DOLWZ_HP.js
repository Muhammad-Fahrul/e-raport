import{r as c,b as N,u as C,j as e,L}from"./index-X8ORgRL-.js";import{a as S,b as D}from"./userApiSlice-PQ-jtVk7.js";const k=()=>{var i;const[n,d]=c.useState({phone:"",oldPassword:"",newPassword:""}),[p,u]=c.useState(null),h=N(),l=C(),m=l.state&&l.state.from.pathname,x=t=>{u(t.target.files[0])},o=t=>{const a=t.target,s=a.type==="checkbox"?a.checked:a.value,b=a.name;d(y=>({...y,[b]:s}))},[f,{isLoading:w}]=S(),[j,{isLoading:g,isError:P,error:r}]=D(),v=async t=>{t.preventDefault();const a=new FormData;a.append("file",p);try{const s=await f(a).unwrap();alert(s.message)}catch(s){alert(s.data.message),console.log(s)}},U=async t=>{var a;t.preventDefault();try{await j({phone:n.phone,oldPassword:n.oldPassword,newPassword:n.newPassword}).unwrap(),alert("Profile updated successfully"),h(m)}catch(s){console.log(((a=s==null?void 0:s.data)==null?void 0:a.message)||s.error)}};return e.jsxs("div",{className:"container-user-edit",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"title",children:"Update Profile"}),e.jsx("p",{style:{opacity:P?1:0,color:"red",textAlign:"center",fontSize:".8rem",height:"15px"},children:((i=r==null?void 0:r.data)==null?void 0:i.message)||""})]}),e.jsxs("form",{className:"form-profile-photo",onSubmit:v,children:[e.jsxs("div",{children:[e.jsx("label",{children:"Profile Photo"}),e.jsx("input",{className:"input",name:"file",type:"file",accept:"image/*",onChange:x})]}),e.jsx("button",{children:"update"})]}),e.jsxs("form",{className:"wrapper",autoComplete:"off",onSubmit:U,children:[e.jsxs("label",{children:[e.jsx("input",{className:"input",name:"phone",type:"number",value:n.phone,onChange:o}),e.jsx("span",{children:"Phone"})]}),e.jsxs("label",{children:[e.jsx("input",{className:"input",name:"oldPassword",type:"text",value:n.oldPassword,onChange:o}),e.jsx("span",{children:"Old Password"})]}),e.jsxs("label",{children:[e.jsx("input",{className:"input",name:"newPassword",type:"text",value:n.newPassword,onChange:o}),e.jsx("span",{children:"New Password"})]}),e.jsx("button",{className:"update",children:"Update"}),(g||w)&&e.jsx(L,{})]})]})};export{k as default};
