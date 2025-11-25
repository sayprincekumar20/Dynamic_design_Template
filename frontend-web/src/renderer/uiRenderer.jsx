import React from 'react';

// Simple mapping: you can replace with Material UI or custom components
function Container({node, children}) {
  const style = layoutToStyle(node.layout);
  return <div style={style}>{children}</div>;
}
function Row({node, children}) {
  const style = {...layoutToStyle(node.layout), display: 'flex', flexDirection: 'row', gap: node.layout?.gap || 12};
  return <div style={style}>{children}</div>;
}
function Column({node, children}) {
  const style = {...layoutToStyle(node.layout), display: 'flex', flexDirection: 'column', gap: node.layout?.gap || 12};
  return <div style={style}>{children}</div>;
}
function Text({node}) {
  return <div>{node.props?.text}</div>;
}
function Image({node}) {
  return <img src={node.props?.src} alt={node.props?.alt || ''} style={{width: node.props?.width || 200}}/>;
}
function Card({node, children}) {
  return <div style={{border: '1px solid #ccc', padding: 12, borderRadius: 8}}><strong>{node.props?.title}</strong><div>{node.props?.content}</div>{children}</div>;
}
function TextInput({node}) {
  return <input placeholder={node.props?.placeholder || ''} />;
}
function Button({node}) {
  return <button onClick={() => handleAction(node.props?.action)}>{node.props?.label || 'Button'}</button>;
}
function List({node}) {
  const items = node.props?.items || [];
  return <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}
function Form({node, children}) {
  return <form onSubmit={(e) => { e.preventDefault(); handleAction(node.props?.action); }}>{children}</form>;
}

const registry = {
  Container, Row, Column, Text, Image, Card, TextInput, Button, List, Form
};

export function renderNode(node, idx=0) {
  if (!node || !node.type) return null;
  const Renderer = registry[node.type];
  const children = (node.children || []).map((c, i) => renderNode(c, i));
  if (!Renderer) return null;
  return <Renderer key={idx} node={node}>{children}</Renderer>;
}

export function renderSpec(spec) {
  return renderNode(spec, 0);
}

function layoutToStyle(layout = {}) {
  const s = {};
  if (layout.padding !== undefined) s.padding = layout.padding;
  if (layout.gap !== undefined) s.gap = layout.gap;
  return s;
}

function handleAction(action) {
  if (!action) return;
  // Implement whitelisted actions: navigate, call_api, submit
  if (action.type === 'navigate') {
    window.location.href = action.route;
  } else if (action.type === 'call_api') {
    // Call your backend endpoint; MUST be proxied and authenticated in production
    console.log('call_api', action);
  } else if (action.type === 'submit') {
    console.log('form submit', action);
  }
}
