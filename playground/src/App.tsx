import { NavLink, Route, Routes } from 'react-router-dom';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import MdFromTailwind from './markdown/FromTailwind.mdx';
import MdCallout from './markdown/Callout.mdx';
import MdCode from './markdown/Code.mdx';

function App() {
  return (
    <div className="max-w-3xl mx-auto my-16 px-5">
      <div className="flex flex-col space-y-1 mb-8">
        <NavLink className={navLinkClassName} to="/">
          Sample from tailwind
        </NavLink>
        <NavLink className={navLinkClassName} to="/callout">
          Callout
        </NavLink>
        <NavLink className={navLinkClassName} to="/code">
          Code
        </NavLink>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <MarkdownRenderer>
              <MdFromTailwind />
            </MarkdownRenderer>
          }
        />
        <Route
          path="/callout"
          element={
            <MarkdownRenderer>
              <MdCallout />
            </MarkdownRenderer>
          }
        />
        <Route
          path="/code"
          element={
            <MarkdownRenderer>
              <MdCode />
            </MarkdownRenderer>
          }
        />
      </Routes>
    </div>
  );
}

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'text-pink-500' : 'text-gray-500';
}

export default App;
