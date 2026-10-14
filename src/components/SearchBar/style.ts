import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
export const styles = StyleSheet.create({
  box: { alignItems: 'center', backgroundColor: '#EEF3FC', borderRadius: 12, flexDirection: 'row', height: 42, paddingHorizontal: 14 },
  icon: { color: colors.muted, fontSize: 17, marginRight: 8 },
  input: { color: colors.text, flex: 1, fontSize: 13 },
});
