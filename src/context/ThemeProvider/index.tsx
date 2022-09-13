
import { THEME_STORAGE_KEY } from '@/shared/contants';
import { Storage } from '@/shared/utils';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

type themeType = 'dark'|'light';

interface ThemeContextValues{
    themeType: themeType;
    setThemeType?: Dispatch<SetStateAction<themeType>>;
}

export const ThemeContext = createContext<ThemeContextValues>({ themeType: 'light' });


export const ThemeContextProvider = ({children}:{children:ReactNode}) => {
    
    
    const [themeType, setThemeType] = useState<themeType>('light');
    const [checkThemeChange, setCheckThemeChange] = useState<boolean>(false);
    useEffect(() => {
        if(typeof window !== 'undefined'){
            const storage = new Storage(THEME_STORAGE_KEY);
            
            console.log('storage', storage.get())
            if(storage.get()){ 
                setThemeType(storage.get())
            }
            setCheckThemeChange(true);
        }
    }, []);
    useEffect(() => {
        if(!checkThemeChange) return;
        const html = document.querySelector('html[data-theme]') as HTMLHtmlElement;
        html.dataset.theme = themeType;
        if(typeof window !== 'undefined'){
            const storage = new Storage(THEME_STORAGE_KEY);
            storage.set(themeType); 
            console.log('storage', storage.get(), 'themeType', themeType )
            
        }
    }, [themeType]);
    
    return (
        <ThemeContext.Provider value={{ themeType, setThemeType }}>
        {children}
        </ThemeContext.Provider>
  );
};