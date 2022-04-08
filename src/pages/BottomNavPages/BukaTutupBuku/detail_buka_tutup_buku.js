/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
//import { DataTable } from 'react-native-paper';
import CONSTANTS from '../../../assets/constants';
import {Picker} from '@react-native-picker/picker';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import {BukaTutupBukuContext} from '../../../components/Context';

const base_url = CONSTANTS.CONFIG.BASE_URL;
const NAVY =CONSTANTS.COLOR.NAVY;
const ORANGE =CONSTANTS.COLOR.ORANGE;

const formatAngka = (angka) => {
	if(angka != "") {
        let separator, prefix = "";
		let number_string = angka.replace(/[^,\d]/g, '').toString(),
		split   	= number_string.split(','),
		sisa     	= split[0].length % 3,
		rupiah     	= split[0].substr(0, sisa),
		ribuan     	= split[0].substr(sisa).match(/\d{3}/gi);
	 
		// tambahkan titik jika yang di input sudah menjadi angka ribuan
		if(ribuan){
			separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		if(angka < 0) {
			rupiah = "-"+rupiah;
		}
		return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
	}
	else{
        let prefix, rupiah = "";
		return prefix == undefined ? rupiah : (rupiah ? '' + rupiah : '');
	}
}

const DetailBukaTutupBuku = ( props ) => {
    const n = props.loop;
    const [id_detail_buka_tutup_buku, setIdDetailBukaTutupBuku] = useState([]); 
    const [nominal, setNominal] = useState([500]);
    const [jumlah_lembar, setJumlahLembar] = useState([]);
    const [total, setTotal] = useState([]);
    const [tableHead, setTableHead] = useState(['Nominal', 'Jumlah', 'Total (Nominal x Jumlah)']);
    const [sum_total, setGrandTotal] = useState(0);
    const [sum_jumlah_lembar, setGrandJumlahLembar] = useState(0);
    const [tableFooter, setTableFooter] = useState(['GRAND TOTAL', sum_jumlah_lembar, sum_total]);
    const [widthArr, setWidthArr] = useState([273, 150, 273]);
    const tableData = [];
    const idDetailBukaTutupBukuArr = [];
    const selectedNominalArr = [];
    const jumlahLembarArr = [];
    const totalArr = [];
    const { getDataDetail } = React.useContext(BukaTutupBukuContext);
    const [editing, setEditing] = useState(false);
    let jeda = false;
    useEffect (() => {
        getDataDetail(id_detail_buka_tutup_buku, nominal, jumlah_lembar, total);
        if(jeda == false ){
            setNominal(selectedNominalArr);
            setJumlahLembar(jumlahLembarArr );
            setTotal(totalArr);
            setIdDetailBukaTutupBuku(idDetailBukaTutupBukuArr);
            console.log(id_detail_buka_tutup_buku);
        }
    },[editing, props.detailBukaTutupBuku, sum_total]);
    
    let m = Object.values(props.detailBukaTutupBuku);
    if(props.detailBukaTutupBuku.length  == 0) {
        let i = 0;
        //console.log(n)
        for (i=0; i < n; i += 1) {
            const rowData = ['','',''];
            tableData.push(rowData);
            //ID
                if(!id_detail_buka_tutup_buku[i]) id_detail_buka_tutup_buku[i] = "";
                idDetailBukaTutupBukuArr.push(id_detail_buka_tutup_buku[i]);
            //ID
            
            //NOMINAL
                if(!nominal[i]) nominal[i] = 500;
                selectedNominalArr.push(nominal[i]);
            //NOMINAL

            //JUMLAH LEMBAR
                if(!jumlah_lembar[i]) jumlah_lembar[i] = "";
                jumlahLembarArr.push(jumlah_lembar[i]);
            //JUMLAH LEMBAR

            //TOTAL
                if(!total[i]) total[i] = "";
                totalArr.push(total[i]);
            //TOTAL
        };
        
        if(i == n && jeda == false ){ 
            //console.log(i);
            setTimeout(()=>{
                //setJeda(true);
                jeda = true;
                hitungGrandTotal();
                //console.log("Kondisi true berjalan");
            },0);
        }
    }
    else{
        
        console.log(editing);
        let i =0;
        for (i = 0; i < m[0].length + n; i += 1) {
            //console.log(m[0][i]);
            const rowData = ['','',''];
            tableData.push(rowData);
            //ID
            if(m[0][i] !== undefined && editing == false ) idDetailBukaTutupBukuArr.push(parseInt(m[0][i].id_detail_buka_tutup_buku));
            else{
                if(!id_detail_buka_tutup_buku[i]) id_detail_buka_tutup_buku[i] = "";
                idDetailBukaTutupBukuArr.push(id_detail_buka_tutup_buku[i]);
            }
            //ID

            //NOMINAL
            if(m[0][i] !== undefined && editing == false) selectedNominalArr.push(parseInt(m[0][i].nominal));
            else {
                if(!nominal[i]) nominal[i] = 500;
                selectedNominalArr.push(nominal[i]);
            }
            //NOMINAL

            //JUMLAH LEMBAR
            if(m[0][i] !== undefined && editing == false) jumlahLembarArr.push(formatAngka(m[0][i].jumlah));
            else{
                if(!jumlah_lembar[i]) jumlah_lembar[i] = "";
                jumlahLembarArr.push(jumlah_lembar[i]);
            }
            //JUMLAH LEMBAR

            //TOTAL
            if(m[0][i] !== undefined && editing == false) totalArr.push(formatAngka((parseInt(m[0][i].nominal) * m[0][i].jumlah).toString()));
            else{
                if(!total[i]) total[i] = "";
                totalArr.push(total[i]);
            }
            //TOTAL 
        };
        if(i == (m[0].length + n) && jeda == false ){
            setTimeout(()=>{
                jeda = true;
                hitungGrandTotal();
                //console.log("Kondisi false berjalan");
            },0);
        }
        
    }

    const setTotalArr = (value, index) => {
        setEditing(false);
        let val = (parseInt(jumlahLembarArr[index].replace(/[^,\d]/g,'')) * selectedNominalArr[index]).toString();
        val = formatAngka(val);
        totalArr[index] = val; 
        setTotal(totalArr);
        setIdDetailBukaTutupBuku(idDetailBukaTutupBukuArr);
        setEditing(true);
        hitungGrandTotal();
    }

    const hitungGrandTotal= () => {
        //JUMLAH LEMBAR
        let sum = 0;
        for (let i = 0; i < jumlahLembarArr.length; i++) {
            sum += parseInt(jumlahLembarArr[i].replace(/[^,\d]/g,''));
        }
        sum = formatAngka(sum.toString());
        setGrandJumlahLembar(sum);//
        //TOTAL
        sum = 0;
        for (let i = 0; i < totalArr.length; i++) {
            sum += parseInt(totalArr[i].replace(/[^,\d]/g,''));
            //console.log(totalArr[i].replace(/[^,\d]/g,''));
        }
        sum = formatAngka(sum.toString());
        //setEditing(false);
        setGrandTotal(sum);
        jeda = true;
    }

    const SelectNominal = (data, index) => {
        const setSelectedNominalArr = (itemValue) =>{
            setEditing(false);
            selectedNominalArr[index] = parseInt(itemValue); 
            setNominal(selectedNominalArr);
            setTotalArr(itemValue, index);
            setEditing(true);
        }
        return (
            <View>
                <TouchableOpacity style={{alignItems:'center', justifyContent:'center'}}>
                    <Picker
                        selectedValue={nominal[index]}
                        style={{ height: 50, width: 270, }}
                        onValueChange={(itemValue) => setSelectedNominalArr(itemValue)}
                    >
                        <Picker.Item label="Rp 500" value={500} />
                        <Picker.Item label="Rp 1.000" value={1000}/>
                        <Picker.Item label="Rp 2.000" value={2000} />
                        <Picker.Item label="Rp 5.000" value={5000} />
                        <Picker.Item label="Rp 10.000" value={10000} />
                        <Picker.Item label="Rp 20.000" value={20000} />
                        <Picker.Item label="Rp 50.000" value={50000} />
                        <Picker.Item label="Rp 100.000" value={100000} />
                        <Picker.Item label="Rp 5.000.000(Pecahan 50.000 x 100 Lembar)" value={5000000} />
                        <Picker.Item label="Rp 10.000.000(Pecahan 100.000 x 10 Lembar)" value={10000000} />
                    </Picker>
                </TouchableOpacity>
            </View>
        );
    }

    const TextInputJumlah = (data, index) => {
        const setJumlahLembarArr = (value) =>{
            setEditing(false)
            value = formatAngka(value);
            jumlahLembarArr[index] = value; 
            setJumlahLembar(jumlahLembarArr);
            setTotalArr(value, index);
            setEditing(true);
        }

        return(
            <TextInput style={styles.textInput} placeholder="Wajib Diisi" placeholderTextColor= 'gray' value={jumlah_lembar[index]} onChangeText={(value) => {setJumlahLembarArr(value)} } keyboardType="numeric" />
        );
    }

    const TextInputTotal = (data, index) => {
        return(
            <TextInput style={styles.textInput} placeholder="auto" placeholderTextColor= 'gray' defaultValue={total[index]}  editable = {false} />
        );
    }

    

    return(
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.textHeader}/>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9', paddingVertical:50}}>
                            {
                                tableData.map((rowData, index) => (
                                    <TableWrapper key={index} style={styles.row}>
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <Cell style={{paddingHorizontal:10}} key={cellIndex} data={cellIndex === 0 ? SelectNominal(cellData, index) : cellIndex === 1 ? TextInputJumlah(cellData,index) : TextInputTotal(cellData, index)} textStyle={styles.textRow} width={cellIndex === 0 ? 270.3 : cellIndex === 2 ? 270.3 : 150.3} />
                                            ))
                                        }
                                    </TableWrapper>
                                ))
                            }
                            </Table>
                        </ScrollView>
                        {/* <Row data={tableFooter} widthArr={widthArr} style={styles.footer} textStyle={styles.textFooter}/> */}
                        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9', paddingVertical:50}}>
                            <TableWrapper style={styles.footer}>
                                    <Cell style={{paddingHorizontal:10}} key={0} data={tableFooter[0]} textStyle={styles.textFooter} width={270.3} />
                                    <Cell style={{paddingHorizontal:10}} key={1} data={sum_jumlah_lembar} textStyle={styles.textFooter} width={150.3} />
                                    <Cell style={{paddingHorizontal:10}} key={2} data={"Rp "+sum_total} textStyle={styles.textFooter} width={270.3} />
                            </TableWrapper>
                        </Table>
                    </Table>
                </View>
            </ScrollView>
    </View>
    );
}

export default DetailBukaTutupBuku;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {  flexDirection: 'row', justifyContent:"center",  height: 50, backgroundColor: NAVY },
    textHeader: { textAlign: 'center', fontWeight: '100', color: 'white', margin: 6 },
    footer: {  flexDirection: 'row', justifyContent:"center",  height: 50, backgroundColor: NAVY },
    textFooter: { textAlign: 'center', fontWeight: '100', color: 'white', margin: 6 },
    textRow: { textAlign: 'center', fontWeight: '100', color: 'black', margin: 6 },
    dataWrapper: { marginTop: -1,  },
    row: { flexDirection: 'row', justifyContent:"center", height: 130, backgroundColor: '#E7E6E1',borderWidth:1, borderColor: '#C1C0B9'},
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2,  },
    btnText: { textAlign: 'center', color: '#fff' },
    textInput:{
        borderWidth:1,
        borderColor:"gray",
        color:"black",
        borderRadius:5,
        fontSize:15,
        height:45,
        textAlign:"center"
    },
})

