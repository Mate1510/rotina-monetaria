import React from 'react'
import styles from '../Loading.module.css'

const Loading = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Carregando...</p>
    </div>
  )
}

export default Loading
