import React from "react"
import Header from "./components/Header"
import Main from "./components/Main"
import { Container } from "@material-ui/core"

function App() {
  return (
    <>
      <Header />
      <Container maxWidth='md'>
        <div>Hello Dapp</div>
        <Main />
      </Container>
    </>
  )
}

export default App
