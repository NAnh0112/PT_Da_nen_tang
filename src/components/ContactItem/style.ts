import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
export const styles = StyleSheet.create({ row: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', paddingVertical: 12 }, body: { flex: 1, marginLeft: 12 }, name: { color: colors.text, fontSize: 15, fontWeight: '600' }, status: { color: colors.muted, fontSize: 11, marginTop: 4 }, arrow: { color: colors.muted, fontSize: 22 } });
