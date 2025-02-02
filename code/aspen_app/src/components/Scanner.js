import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, Center, View } from 'native-base';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { LanguageContext } from '../context/initialContext';
import { navigateStack } from '../helpers/RootNavigator';
import { getTermFromDictionary } from '../translations/TranslationService';
import { loadError } from './loadError';
import { loadingSpinner } from './loadingSpinner';

export default function Scanner() {
     const isFocused = useIsFocused();
     const [isLoading, setLoading] = React.useState(false);
     const [hasPermission, setHasPermission] = React.useState(null);
     const [scanned, setScanned] = React.useState(false);
     const { language } = React.useContext(LanguageContext);

     React.useEffect(() => {
          (async () => {
               const { status } = await BarCodeScanner.requestPermissionsAsync();
               setHasPermission(status === 'granted');
          })();
     }, []);

     const handleBarCodeScanned = ({ type, data }) => {
          console.log(data);
          console.log(type);
          setLoading(true);
          if (!scanned) {
               data = cleanBarcode(data, type);
               setScanned(true);
               navigateStack('BrowseTab', 'SearchResults', { term: data, type: 'catalog', prevRoute: 'DiscoveryScreen', scannerSearch: true });
               setLoading(false);
          } else {
               setLoading(false);
          }
     };

     if (hasPermission === null) {
          return loadingSpinner(getTermFromDictionary(language, 'scanner_request_permissions'));
     }

     if (hasPermission === false) {
          return loadError(getTermFromDictionary(language, 'scanner_denied_permissions'));
     }

     if (isLoading) {
          return loadingSpinner();
     }

     return (
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
               {isFocused && (
                    <>
                         <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={[StyleSheet.absoluteFillObject, styles.container]} barCodeTypes={[BarCodeScanner.Constants.BarCodeType.upc_a, BarCodeScanner.Constants.BarCodeType.upc_e, BarCodeScanner.Constants.BarCodeType.upc_ean, BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8]}>
                              <BarcodeMask edgeColor="#62B1F6" showAnimatedLine={false} />
                         </BarCodeScanner>
                         {scanned && (
                              <Center pb={20}>
                                   <Button onPress={() => setScanned(false)}>{getTermFromDictionary(language, 'scan_again')}</Button>
                              </Center>
                         )}
                    </>
               )}
          </View>
     );
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
     },
});

function cleanBarcode(barcode, type) {
     barcode = barcode.toUpperCase();

     if ((type === '512' || type === 'org.gs1.UPC-A') && Platform.OS === 'ios') {
          barcode = barcode.substring(1);
     }

     return barcode;
}