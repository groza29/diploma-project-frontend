import { Link } from 'react-router-dom';

interface ListFooterProp {
  title: string;
  items: string[];
}

const ListFooter: React.FC<ListFooterProp> = ({ title, items }) => (
  <div>
    <div className="my-4">
      <h3 className=" text-text font-bold">{title}</h3>
    </div>
    <ul className="grid items-start gap-4">
      {items.map((item, index) => {
        const itemPath = item.toLowerCase().replace(/\s+/g, '-');
        return (
          <li key={index}>
            <Link to={`/${itemPath}`} className={`pe-3 py-2 text-text-secondary font-thin`}>
              {item}
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
);

export default ListFooter;
