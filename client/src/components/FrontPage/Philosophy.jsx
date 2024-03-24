import React from 'react'
import { 
    Box,
    Grid,
    styled,
    Typography,
} from '@mui/material'
// img
import moneymagnet1 from '../../assets/moneymagnet1.png'
import moneymagnet2 from '../../assets/moneymagnet2.webp'


const Philosophy = () => {

    const CustomGridItem = styled(Grid) ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    })
    
    const CustomTypography = styled(Typography) ({
        fontSize: '1.1rem',
        textAlign: 'start',
        lineHeight: '1.5',
        color: '#515151',
        marginTop: '1.5rem',
    })

  return (
    <>
        <Grid container spacing={{ xs: 4, sm: 4, md: 0 }}   
        sx={{
            py: 10,
            px: 2,
             
        }}
        >
            <CustomGridItem item xs={12} sm={8} md={6} 
            component = 'section'
           
            >
                <Box component='article'
                sx={{
                    px: 4,
                }}
                >
                    <Typography 
                    variant='h4'
                    component='h3'
                    sx={{ 
                    fontWeight: '700',
                    textAlign: 'start',
                    color: '#009933',
                    }}
                    >
                    Our Philosophy
                    </Typography>
                    <CustomTypography>
                    Empowering Financial Futures through Innovative AI Solutions: Our commitment extends beyond conventional budgeting practices. 
                    We leverage cutting-edge artificial intelligence to revolutionize financial management, 
                    enhancing the financial literacy and well-being of individuals and families. By challenging traditional norms, 
                    we engineer lasting solutions that pave the way for a brighter financial future.
                    </CustomTypography> 
                </Box>

            </CustomGridItem>
            
            <Grid item xs={12} sm={4} md={6}>
                <img src={moneymagnet1} alt="" 
                style={{
                    width: '100%',
                }}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={6}
            sx={{
                order: {xs: 4, sm: 4, md: 3}
            }}
            >
                <img src={moneymagnet2} alt="" 
                style={{ 
                    width: "100%",
                }}
                />
            </Grid>

            <CustomGridItem item xs={12} sm={8} md={6}
            sx={{
                order: {xs: 3, sm: 3, md: 4}
            }}
            >
                <Box component='article'
                sx={{
                    px: 4,
                }}
                >
                    <Typography 
                    variant='h4'
                    component='h3'
                    sx={{ 
                    fontWeight: '700',
                    textAlign: 'start',
                    color: '#009933',
                    }}
                    >
                    Elevating Financial Well-Being
                    </Typography>
                    <CustomTypography>
                    At Money Magnet, we champion the fusion of financial well-being and strategic planning,
                    underpinned by advanced artificial intelligence (AI) and a commitment to improving the financial health of individuals and families. 
                    We challenge budgeting conventions, and engineer enduring financial solutions that improve our user’s financial literacy.
                    </CustomTypography>
                </Box>
            </CustomGridItem>
        </Grid>
    </>
  )
}

export default Philosophy