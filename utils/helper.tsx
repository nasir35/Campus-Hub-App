import {Text, Linking} from 'react-native'


export const renderDetails = (text: string) => {
    const words = text.split(/(https?:\/\/\S+|www\.\S+)/g); // Split by URLs including www links
    return words.map((word, index) => {
      if (word.match(/https?:\/\/\S+/) || word.match(/www\.\S+/)) {
        const link = word.startsWith("www.") ? `https://${word}` : word;
        return (
          <Text
            key={index}
            className="text-blue-500 underline"
            onPress={() => Linking.openURL(link)}
          >
            {word}
          </Text>
        );
      }
      return <Text key={index} className="text-gray-700">{word}</Text>;
    });
}