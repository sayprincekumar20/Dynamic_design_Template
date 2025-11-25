import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, Button, Text, View } from 'react-native';
import axios from 'axios';
import { renderNode } from './src/renderer/uiRenderer.native';

export default function App() {
  const [instruction, setInstruction] = useState('Show a welcome title and a signup form with name and submit.');
  const [spec, setSpec] = useState(null);

  async function generate() {
    const resp = await axios.post('http://10.0.2.2:4000/generate', { instruction }); // use emulator host mapping or real host
    setSpec(resp.data.spec);
  }

  return (
    <SafeAreaView style={{flex:1, padding: 16}}>
      <Text>Dynamic UI (Mobile)</Text>
      <TextInput value={instruction} onChangeText={setInstruction} style={{height:100, borderWidth:1, marginVertical:8}} />
      <Button title="Generate UI" onPress={generate} />
      <ScrollView style={{marginTop:16}}>
        {spec ? renderNode(spec) : <Text>No spec</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
