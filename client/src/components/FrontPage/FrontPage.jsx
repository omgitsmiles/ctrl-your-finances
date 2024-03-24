import { useState } from 'react';
import { Button,  Modal, Stack, Box, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { AppContext } from '../../context/Context';
import Login from "./Login"
import SignUp from "./SignUp"
import Philosophy from './Philosophy';
import Header from './Header';
import Footer from '../Footer';
import Navbar from '../Navbar';

function FrontPage() {
    const navigate = useNavigate();
    const { user } = AppContext();


    return (
        <>
             <Header />
             <Philosophy />
             {/* <Footer /> */}
        </>
    )
}

export default FrontPage