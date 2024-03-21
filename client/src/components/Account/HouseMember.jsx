
import { ListItem, ListItemButton, ListItemText } from '@mui/material';

function HouseMember({houseMember}) {

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText primary={houseMember.name} />
                <ListItemText primary='status' />
            </ListItemButton>
        </ListItem>
    )
}

export default HouseMember