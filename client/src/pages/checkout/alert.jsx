import './style-alert.css'
export default function AlertMessage({isOpen}){
    if(!isOpen) return null;
    return <div className="alert-page">
        <div>Do you want to remove this item?</div>
    </div>
}