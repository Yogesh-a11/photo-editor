import './app.css'
import LeftBar from './components/leftBar/leftBar'
import TopBar from './components/topBar/topBar'
import Gallary from './components/gallery/gallery' 

const App = () => {
  return (
    <div className='app'>
      <LeftBar />
      <div className='content'>
        <TopBar />
        <Gallary />
      </div>
    </div>
  )
}

export default App