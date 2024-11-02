import React, { useEffect, useState } from 'react'; 
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearEnrollments, enrollCourse } from '../../ReduxStore/EnrollSlice';
import { toast } from 'react-toastify';
import { getCartItems, removeFromCart as removeFromCartService } from '../../Services/courseService';  
import './Cart.css';
import { FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { removeFromReduxCart } from '../../ReduxStore/CartSlice';

function Cart() {
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation(); 

 const fetchCartItems = async () => {
            try {
                const response = await getCartItems(userId, ''); 
                setCartItems(response.cartItems || []);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                toast.error('Failed to fetch cart items.');
            }
        };
        
    useEffect(() => {
       if(userId){
        fetchCartItems();
       }
       else{
        toast.error('Please log in to view your cart items.');
    }
        window.scrollTo(0, 0);
    }, [userId]);

    const formatCartItems = (items) => {
        return items.map(item => ({
            courseId: item?.course?.courseId,
            title: item?.course?.title,
            price: item?.course?.price,
        }));
    };

    const calculateTotalPrice = (items) => {
        return items.reduce((total, item) => total + item.course.price, 0);
    };

    const handleEnroll = async () => {
        const formattedCartItems = formatCartItems(cartItems);

        if (localStorage.getItem('token')) {
            dispatch(clearEnrollments());
            dispatch(enrollCourse(formattedCartItems));
            toast.success('Successfully prepared for enrollment! Proceed to payment.');
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    const handleRemoveFromCart = async (courseId) => {
        try {
            const response = await removeFromCartService(userId, courseId);
            if (response.status === 200) {
                dispatch(removeFromReduxCart({ courseId }));  
                toast.success('Item removed from cart!');
                setCartItems(response.data.cartItems || []);
                 
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart.');
        }
    };
    
    if (cartItems.length === 0) {
        return (
            <div className='empty-cart'>
                <p className='empty-cart-title'>YOUR BAG IS EMPTY</p>
                <p className='empty-cart-message'>There is nothing in your bag.</p>
                <p className='empty-cart-message'>Let's add something new to your collection</p>
            </div>
        );
    }

    const numOfItem = cartItems.length;  
    const totalPrice = calculateTotalPrice(cartItems);

    return (
        <div className='cart-container'>
            <p className='cart-title'>{t('Cart')}</p>
            <div className='cart-content'>
                <div className='cart-items'>
                    {cartItems.map(cartItem => (
                        <div className='cart-item' key={cartItem.course.courseId}>
                            <Link to={`/coursedetails/${cartItem.course.courseId}`}>
                                <img src={cartItem.course.imageUrl} className='cart-item-image' alt={cartItem.course.title} />
                            </Link>
                            <div className='cart-item-details'>
                                <p className='cart-item-name'>{cartItem.course.title}</p>
                                <p className='cart-item-price'>$ {cartItem.course.price.toFixed(2)}</p>
                                <FaTrash onClick={() => handleRemoveFromCart(cartItem.course.courseId)} className='cart-delete-button' /> 
                            </div>
                        </div>
                    ))}
                </div>
                <div className='order-summary'>
                    <div className='order-summary-header'>
                        <p className='order-summary-title'>{t('OrderSummary')}</p>
                        <p className='order-summary-count'>({numOfItem} {t('Items')})</p>
                    </div>
                    <div className='order-summary-details'>
                        <p>{t('Order Value')}</p>
                        <p>$ {totalPrice.toFixed(2)}</p>
                    </div>
                    <div className='order-summary-total'>
                        <p className='total-label'>{t('GrandTotal')}</p>
                        <p>$ {totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <button className='proceed-button' onClick={handleEnroll}>{t('Checkout')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
