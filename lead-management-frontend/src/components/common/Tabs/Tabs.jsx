import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const Tabs = ({ tabs = [], defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index, tabs[index]);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'primary.gray',
          borderRadius: 10,
          gap: 1,
          p: 0.5,
        }}
      >
        {tabs.map((tab, index) => (
          <Button
            key={index}
            onClick={() => handleTabChange(index)}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '14px',
              padding: '6px 67px',
              minWidth: 'auto',
              borderRadius: 10,
              
              backgroundColor: activeTab === index ? '#ffffff' : 'transparent',
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>
      <Box sx={{ mt: 1, backgroundColor: '#ffffff', borderRadius: 3, p: 3 }}>
        {tabs[activeTab]?.content}
      </Box>
    </Box>
  );
};

export default Tabs;


