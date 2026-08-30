import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 48,
        fontSize: 11,
        lineHeight: 1.6,
        color: '#3f3f46',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e7',
        paddingBottom: 12,
    },
    title: {
        fontSize: 26,
        color: '#18181b',
        marginTop: 40,
        paddingBottom: 16,
        borderBottomWidth: 3,
        borderBottomColor: '#e0301e',
    },
    paragraph: {
        marginTop: 20,
    },
});

function DishCard({ item }) {
    return (
    <View>
        {item.dishname || ''}
        R$: {item.price || 0.00}
        {item.description}
    </View>
)}

export default function ListDishPDF({ listItems }) {
    // Create styles
    return (

        <Document title="Lista de Pratos" id='test'>
            <Page size="A4">
                <View>
                    <Text style={styles.title}>Lista de Pratos</Text>
                </View>
                <View>
                    {listItems.map((dish) => (
                      <DishCard item={dish}/>   
                    ))}
                </View>
            </Page>
        </Document >
    );
}
