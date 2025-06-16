import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const languages = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' }
];

const LanguageSelector = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>言語</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label="言語"
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector; 