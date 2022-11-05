import "./List.css"
const List = (props) => {
  return (
    <div className="list-item">
      <p className={`title ${props.checked ? "done" : ""}`}>{props.title}</p>
      <div className="button-list">
        <button className="list-button" onClick={()=>props.completeData(props.id)}>✅</button>
        <button className="list-button" onClick={()=>props.editData(props.id)}>✏️</button>
        <button className="list-button" onClick={()=>props.removeData(props.id)}>❌</button>
      </div>
    </div>
  );
};
export default List;
