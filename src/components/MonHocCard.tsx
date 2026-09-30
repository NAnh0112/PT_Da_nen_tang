import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface MonHocItem {
  id: string;
  tenMon: string;
  soBaiHoc: number;
  tienDo: number;
  icon: string;
  iconBg: string;
  mauTienDo: string;
}

export default function MonHocCard({ item }: { item: MonHocItem }) {
  const isCompleted = item.tienDo >= 100;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => {}}
    >
      <View style={styles.rowTop}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.tenMon}>{item.tenMon}</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
          <Text style={styles.soBaiHoc}>📖 {item.soBaiHoc} bài học</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${item.tienDo}%`, backgroundColor: item.mauTienDo },
            ]}
          />
        </View>
        <Text style={[styles.phanTramText, isCompleted && styles.completedText]}>
          {isCompleted ? 'Đã hoàn thành' : `${item.tienDo}%`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EBECF0',
  },
  cardPressed: {
    backgroundColor: '#E8F0FE',
    borderColor: '#4C7BF4',
    transform: [{ scale: 0.98 }],
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tenMon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#091E42',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#8993A4',
    fontWeight: 'bold',
  },
  soBaiHoc: {
    fontSize: 12,
    color: '#7A869A',
    marginTop: 4,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#EBECF0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  phanTramText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5E6C84',
    width: 85,
    textAlign: 'right',
  },
  completedText: {
    color: '#36B37E',
    fontWeight: '700',
  },
});