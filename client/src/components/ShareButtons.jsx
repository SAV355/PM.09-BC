import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Telegram, WhatsApp} from '@mui/icons-material';  // был удален соцсеть ВК (вызывала критическую ошибку - export 'Vk' (imported as 'Vk') was not found in '@mui/icons-material' (possible exports: Abc, AbcOutlined, и т.д.)

const ShareButtons = ({ title, text, url }) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url || window.location.href);
    // const encodedTitle = encodeURIComponent(title); // работает под ВК

    const shares = [
        { name: 'Telegram', icon: <Telegram />, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
        { name: 'WhatsApp', icon: <WhatsApp />, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
        // { name: 'VK', icon: <Vk />, href: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}` }, // закоментированно так как вызывает критическую ошибку, причина импорт из библиотеки @mui/icon-material
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2 }}>
            {shares.map((s) => (
                <Tooltip title={`Поделиться в ${s.name}`} key={s.name}>
                    <IconButton
                        component="a"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0' } }}
                    >
                        {s.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </Box>
    );
};

export default ShareButtons;