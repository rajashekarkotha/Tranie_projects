
const MsgBox = ( {msg,type} : {msg:string,type:'info'|'error'} ) => (
    <div className={`alert ${type==='info'?"alert-info":"alert-danger"} mx-auto fw-bold `}>
        <span>{msg}</span>
    </div>
);

export default MsgBox;