import React from 'react';
import './ProductDetail.scss';

const ProductDetail = ({ product }) => {
  return (
    <div className='product-detail'>
      <div className='image-container'>
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/7f8648a9-6f79-41f4-93b0-07a9015d0bc2/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <video autoPlay="" loop="" playsInline="" tabIndex="-1" muted="">
        <source src="https://static.nike.com/a/videos/q_90,vc_vp9/aa95b88e-57d9-4e42-8d4b-40ec4fb61225/video.webm" type="video/webm; codecs=vp9" />
        <source src="https://static.nike.com/a/videos/q_90/aa95b88e-57d9-4e42-8d4b-40ec4fb61225/video.webm" type="video/webm" />
        <source src="https://static.nike.com/a/videos/q_90,vc_h265/aa95b88e-57d9-4e42-8d4b-40ec4fb61225/video.mp4" type="video/mp4; codecs=hvc1" />
        <source src="https://static.nike.com/a/videos/q_90/aa95b88e-57d9-4e42-8d4b-40ec4fb61225/video.mp4" type="video/mp4" />
        <source src="https://static.nike.com/a/videos/q_90/aa95b88e-57d9-4e42-8d4b-40ec4fb61225/video.ogv" type="video/ogg" />
    </video>
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/023ca8d5-882c-475a-91a7-75cf4ec76d98/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/a0f8fef5-eca7-4f6c-b083-8963b3ba7ef3/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/05726788-8a65-45e8-a473-8fe19a1ade6e/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/7fd2fbde-e932-4e2c-95ff-c1ba9181e89f/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/f1c61f3a-463d-410b-903a-ffd8ed5bad45/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
        <img src='https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5,q_80/bda290fd-391c-4eac-8cfa-8697aec82658/zoomx-invincible-run-flyknit-2-mens-road-running-shoes-gxNJpn.png' alt='shoes' />
      </div>
      <div className='detail'>
        <h2 className='name'>Nike ZoomX Invincible Run Flyknit 2</h2>
        <h4 className='desc'>Men's Road Running Shoes</h4>
        <p className='price'>$500</p>
        <div className='size-selection'>
            <p>Select size</p>
            <div className="wrapper">
                <div className='size'>36</div>
                <div className='size'>37</div>
                <div className='size'>38</div>
                <div className='size'>38</div>
                <div className='size'>38</div>
                <div className='size'>38</div>
                <div className='size'>38</div>
                <div className='size'>38</div>
            </div>
        </div>
        <div className='color-selection'>
            <p>Select color</p>
            <div className="wrapper">
                <div className='color' style={{ backgroundColor: "white"}}></div>
                <div className='color' style={{ backgroundColor: "crimson"}}></div>
                <div className='color' style={{ backgroundColor: "black"}}></div>
            </div>
        </div>
        <button className='add'>Add to Bag</button>
        <h4 className='quote'>Keep pushing your runs to the limit. The Nike ZoomX Invincible Run Flyknit 2 keeps you going with the same supersoft feel that lets you feel the potential when your foot hits the pavement. We created the shoe with plenty of snappy responsiveness and our highest level of support to keep you feeling secure and competitive. It's one of our most tested shoes, still designed for you to stay on the track and away from the sidelines.</h4>
      </div>
    </div>
  )
}

export default ProductDetail;