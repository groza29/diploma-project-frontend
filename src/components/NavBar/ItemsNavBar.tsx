import { Link, useLocation } from 'react-router-dom';

interface ItemsNavBarProps {
  items: string[];
}

const ItemsNavBar: React.FC<ItemsNavBarProps> = ({ items }) => {
  const location = useLocation(); // Ensure location is inside the component

  return (
    <ul className="flex gap-6">
      {items.map((item, index) => {
        const itemPath = item.toLowerCase().replace(/\s+/g, '-');
        const isActive =
          location.pathname === '/' && item === 'Home'
            ? true
            : location.pathname === '/' + itemPath;

        return (
          <li key={index}>
            <Link
              to={`/${itemPath}`}
              className={`px-3 py-2 rounded-md ${
                isActive ? 'bg-selected bg-opacity-45 text-text' : 'hover:text-selected'
              }`}
            >
              {item}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemsNavBar;
