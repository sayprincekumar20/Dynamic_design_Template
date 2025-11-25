import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

function Container({node, children}) {
  return <View style={layoutToStyle(node.layout)}>{children}</View>;
}
function Row({node, children}) {
  return <View style={[{flexDirection:'row', gap: node.layout?.gap || 8}, layoutToStyle(node.layout)]}>{children}</View>;
}
function Column({node, children}) {
  return <View style={[{flexDirection:'column', gap: node.layout?.gap || 8}, layoutToStyle(node.layout)]}>{children}</View>;
}
function TextNode({node}) {
  return <Text>{node.props?.text}</Text>;
}
function ImageNode({node}) {
  return <Image source={{uri: node.props?.src}} style={{width: node.props?.width || 120, height: node.props?.height || 80}} />;
}
function Card({node, children}) {
  return <View style={{borderWidth:1, padding:12, borderRadius:8}}><Text>{node.props?.title}</Text><Text>{node.props?.content}</Text>{children}</View>;
}
function TextInputNode({node}) {
  return <TextInput placeholder={node.props?.placeholder || ''} style={{borderWidth:1, padding:8}}/>;
}
function ButtonNode({node}) {
  return <TouchableOpacity onPress={() => handleAction(node.props?.action)} style={{padding:12, backgroundColor:'#007bff', borderRadius:6}}><Text style={{color:'#fff'}}>{node.props?.label||'Button'}</Text></TouchableOpacity>;
}
function List({node}) {
  const items = node.props?.items || [];
  return <View>{items.map((it, i) => <Text key={i}>• {it}</Text>)}</View>;
}
function Form({node, children}) {
  return <View>{children}</View>;
}

const registry = {
  Container, Row, Column, Text: TextNode, Image: ImageNode, Card, TextInput: TextInputNode, Button: ButtonNode, List, Form
};

export function renderNode(node, idx=0) {
  if (!node || !node.type) return null;
  const Renderer = registry[node.type];
  const children = (node.children || []).map((c,i) => renderNode(c,i));
  if (!Renderer) return null;
  return <Renderer key={idx} node={node}>{children}</Renderer>;
}

function layoutToStyle(layout = {}) {
  const s = {};
  if (layout.padding) s.padding = layout.padding;
  return s;
}

function handleAction(action) {
  console.log('action', action);
}
