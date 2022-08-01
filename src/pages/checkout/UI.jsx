import {client, ListCartItems} from './list-cart-items';
import {ApolloProvider} from '@apollo/client';
import CustomerInforForm from './customer-infor-form';
import GetFee from './fee';
import {BrowserRouter,Routes,Route,Link} from "react-router-dom";
import SuccessMessage from './success-page';

function CheckOutUI() {
  return (<div>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ListCartItems />}/>
          <Route path='/thanhtoan' element={<CustomerInforForm />}/>
          <Route path='/thanhcong' element={<SuccessMessage />}></Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </div>
  );
}

export default CheckOutUI;