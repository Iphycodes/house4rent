// import type { NextPage } from 'next'
// // import Head from 'next/head'
// // import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// const Home: NextPage = () => {
//   return (
//     <div className={styles.container}>
//       <h1>Hello World</h1>
//     </div>
//   )
// }
// export default Home


import { ReactNode } from 'react'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  return <>Hello World</>
}
Home.getLayout = ((page: ReactNode) => <>{page}</>)
export default Home