import Sidebar from './Sidebar/Sidebar'
import Menu from './Menu/Menu'
import './Main.css'
const Main = ()=>{
    return(
        <>
        <div className="ma">
        <Sidebar />
        <Menu />
        </div>
        </>
    )
}
export default Main