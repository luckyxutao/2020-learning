import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ContentLoader from 'react-content-loader';



export default ReactDOMServer.renderToStaticMarkup(<ContentLoader 
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#942e2e"
    foregroundColor="#ecebeb"
    >
    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" /> 
    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" /> 
    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" /> 
    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" /> 
    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" /> 
    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" /> 
    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
    </ContentLoader>);