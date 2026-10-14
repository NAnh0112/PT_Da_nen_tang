import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { styles } from './style';
import { SettingsScreenProps } from './type';
export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  return <View style={styles.container}><ScreenHeader title="Cài đặt" subtitle="Quản lý tài khoản của bạn" /><View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>👨🏻</Text></View><Text style={styles.name}>Nguyễn Văn A</Text><Text style={styles.account}>nguyenvana@email.com</Text></View><Text style={styles.section}>TÀI KHOẢN</Text><View><View style={styles.row}><Text style={styles.rowIcon}>♙</Text><Text style={styles.rowText}>Thông tin cá nhân</Text><Text style={styles.arrow}>›</Text></View><View style={styles.row}><Text style={styles.rowIcon}>🔔</Text><Text style={styles.rowText}>Cài đặt thông báo</Text><Text style={styles.arrow}>›</Text></View><View style={styles.row}><Text style={styles.rowIcon}>?</Text><Text style={styles.rowText}>Trợ giúp</Text><Text style={styles.arrow}>›</Text></View></View><TouchableOpacity style={styles.logout} onPress={onLogout}><Text style={styles.logoutText}>Đăng xuất</Text></TouchableOpacity></View>;
}
