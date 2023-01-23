import Header from './components/Header';
import "./lib/dayjs"
import SummaryTable from './components/SummaryTable';

export function App() {
   return (
      <div className=" h-fill  w-screen flex justify-center items-center pt-[0.1px]">
         <div className="w-full max-w-5xl px-6 flex flex-col  gap-16">
            <Header />
            <SummaryTable />
         </div>
      </div>
   );
}
