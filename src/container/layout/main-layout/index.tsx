import {ReactNode} from 'react'




interface MainLayoutProps {
    children: ReactNode | ReactNode[];
}

export const MainLayoutContainer = (props: MainLayoutProps) => {
    const {children} = props

    return (
        <div>
            {children}
        </div>
        
    )
}