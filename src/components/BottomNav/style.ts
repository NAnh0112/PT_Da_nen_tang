import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
export const styles = StyleSheet.create({ bar: { backgroundColor: colors.white, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', paddingBottom: 8, paddingTop: 8 }, item: { alignItems: 'center', flex: 1 }, icon: { fontSize: 20 }, label: { color: colors.muted, fontSize: 10, marginTop: 3 }, active: { color: colors.primary, fontWeight: '700' } });
