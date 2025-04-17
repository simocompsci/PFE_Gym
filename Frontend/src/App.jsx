import { MyChart } from './components/ui/MyChart';
import { Button } from '@/components/ui/button';
import './index.css'

function App() {

  return (
    <>

      <div className='bg-gray-100 min-h-screen flex flex-col justify-center items-center overflow-scroll gap-2'>
        <h1 className='text-5xl text-center '>React Project with tailwind and shadcn</h1>
        <Button variant={"default"}>Click Me</Button>
        <MyChart />
        <MyChart />
        <MyChart />
        
      </div>
    
    </>


  )
}
export default App
