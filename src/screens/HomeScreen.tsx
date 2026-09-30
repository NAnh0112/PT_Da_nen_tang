import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ThongKe from '../components/ThongKe';
import TimKiem from '../components/TimKiem';
import MonHocCard, { MonHocItem } from '../components/MonHocCard';
import BottomTab from '../components/BottomTab';

const danhSachMonHoc: MonHocItem[] = [
  {
    id: '1',
    tenMon: 'Lập trình di động',
    soBaiHoc: 12,
    tienDo: 70,
    icon: '</>',
    iconBg: '#EDE9FE',
    mauTienDo: '#6366F1',
  },
  {
    id: '2',
    tenMon: 'Cơ sở dữ liệu',
    soBaiHoc: 10,
    tienDo: 50,
    icon: '🗄️',
    iconBg: '#EBF9F1',
    mauTienDo: '#22C55E',
  },
  {
    id: '3',
    tenMon: 'Mạng máy tính',
    soBaiHoc: 8,
    tienDo: 25,
    icon: '🌐',
    iconBg: '#FFEBEA',
    mauTienDo: '#EF4444',
  },
  {
    id: '4',
    tenMon: 'Thiết kế giao diện người dùng',
    soBaiHoc: 12,
    tienDo: 80,
    icon: '🎨',
    iconBg: '#EFF6FF',
    mauTienDo: '#3B82F6',
  },
  {
    id: '5',
    tenMon: 'Kỹ thuật phần mềm',
    soBaiHoc: 15,
    tienDo: 100,
    icon: '⚙️',
    iconBg: '#EBF9F1',
    mauTienDo: '#22C55E',
  },
];

export default function HomeScreen() {
  const renderListHeader = () => (
    <>
      <Header />
      <ThongKe />
      <TimKiem />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh sách môn học</Text>
        <TouchableOpacity activeOpacity={0.6}>
          <Text style={styles.seeAllText}>Xem tất cả ›</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={danhSachMonHoc}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MonHocCard item={item} />}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE', 
  },
  listContent: {
    paddingHorizontal: 18, 
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#101828',
  },
  seeAllText: {
    fontSize: 13,
    color: '#3B76F6',
    fontWeight: '600',
  },
});