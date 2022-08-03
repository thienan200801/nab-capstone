import { Link } from 'react-router-dom';
import successImg from '../imgsrc/success.gif';
import './success-page.css';

export default function SuccessMessage(){
    return(
        <div className='wrapper'>
            <img src={successImg} alt="success" className='success-img'/>
            <div className='text'>
                <div className='title'>ĐẶT HÀNG THÀNH CÔNG</div>
                <div className='message'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <div className='message-content'>
                        Chúc mừng bạn đã đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
                    </div>
                </div>
                <button type="button" class="btn btn-dark btn-lg inverted-2">
                    <Link to="/" className="btnBackToHome">
                    Về trang chủ
                    </Link>
                </button>
            </div>
        </div>
    )
}