
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function BankItem({account}) {

    return (
        <ListItem disablePadding >
            <ListItemButton>
                <ListItemText primary={account.name} />
            </ListItemButton>
        </ListItem>
    )
}

export default BankItem