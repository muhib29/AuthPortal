import React from 'react'

const Logout = () => {

  return (
    <>
    <div className="logout">
        <h1>Logout</h1>
        <button onClick={() => localStorage.removeItem("token")} className="logout-button">Logout</button>
    </div>
    </>
  )
}

export default Logout