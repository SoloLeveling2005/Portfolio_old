import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function RelatedArticles(props:{'id':string, 'title':string}) {
  const id = props.id
  const title = props.title
  return (
    <Link to={`/article/${id}`} className="list-group-item list-group-item-action">
        <p className="mb-1 fw-bold">{title}</p>
    </Link>
  );
}

export default RelatedArticles;
