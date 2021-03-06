import React, { Component } from 'react'
import PreviewImage from '../../Image/PreviewImage';
import Label from '../../Label/Label';
import TextField from '../../Field/TextField';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setTitlePageAdmin, editProductRequest } from '../../../actions/adminAction';
import { getAllCategoriesRequest } from '../../../actions/categoryAction';
import { getClothesWithIdRequest } from '../../../actions/clothesAction';
import { regImg } from '../../../constant/constant';
import defaultImg from '../../defaultImg.png';
import * as Option from '../../../constant/options';
import MultiSelectBox from '../../SelectBox/MultiSelectBox';
import SelectBox from '../../SelectBox/SelectBox';
import Button from '../../Button/Button';

class AdminEditProduct extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            categories: [],
            brand: Option.optionsBrand[0].value,
            colors: [],
            description: '',
            sizes: [],
            price: '',
            quantity: '',
            img: [],
            previewImg: Array.from({ length: 4 }, () => (defaultImg)),
            optionCategories: [],
            sizeValue: [],
            colorValue: [],
            categoriesValue: [],
            brandValue: null
        }
    }

    checkFileType = (type) => {
        if (regImg.test(type)){
            return true;
        } else {
            alert('Only image file can upload');
            return false;
        }
    }

    checkFileSize = (size) => {
        if (size >= 2000000) {
            alert('File size up to ' + size);
            return false;
        } else {
            return true;
        }
    }

    setUpState = (cloth) => {
        let previewImg = [];
        for (let index = 0; index < cloth.img.length; index++) {
            const element = cloth.img[index];
            previewImg.push("http://localhost:2000" + element);
        }
        let brandValue = {label: cloth.brand, value: cloth.brand}
        let colorValue = [];
        for (let index = 0; index < cloth.colors.length; index++) {
            const element = cloth.colors[index];
            colorValue.push({label:element, value:element});
        }
        let sizeValue = [];
        for (let index = 0; index < cloth.sizes.length; index++) {
            const element = cloth.sizes[index];
            sizeValue.push({label:element, value:element});
        }
        let categoriesValue = [];
        let categories = [];
        for (let index = 0; index < cloth.ofArrayCategory.length; index++) {
            const element = cloth.ofArrayCategory[index];
            categoriesValue.push({label:element.name, value:element._id});
            categories.push(element._id);
        }
        this.setState({
            name: cloth.name,
            categories,
            brand: cloth.brand,
            colors: cloth.colors,
            description: cloth.description,
            sizes: cloth.sizes,
            price: cloth.price,
            quantity: cloth.quantity,
            img: [],
            previewImg,
            brandValue,
            colorValue,
            categoriesValue,
            sizeValue
        });
    } 

    componentDidMount = () => {
        this.props.setTitlePage('Edit product');
        this.props.getAllCategories();
        this.props.getClothesWithId(this.props.match.params.id);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.categories != this.props.categories) {
            this.setOptionCategories(this.props.categories);
        }
        if (prevProps.cloth != this.props.cloth) {
            this.setUpState(this.props.cloth);
        }
        if (prevProps.clothAfterEdit != this.props.clothAfterEdit) {
            this.props.history.push('/admin');
        }
    }

    setOptionCategories = (categories) => {
        let optionCategories = [];
        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
            optionCategories.push({
                label: element.name,
                value: element._id
            })
        }
        this.setState({ optionCategories });
    }

    handleImgChange = (e, index) => {

        let files = e.target.files;
        let img = [...this.state.img];
        let previewImg = [...this.state.previewImg];

        if (files.length === 1) {
            if (this.checkFileType(files[0].type) && this.checkFileSize(files[0].size)) {
                let previewImgFile = URL.createObjectURL(files[0]);
                previewImg[index] = previewImgFile;
                img[index] = files[0];
            } else {
                return;
            }
        } else {
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                if (this.checkFileType(element.type) && this.checkFileSize(element.size)) {
                    let previewImgFile = URL.createObjectURL(element);
                    previewImg[index] = previewImgFile;
                    img[index] = element;
                } else {
                    return;
                }
            }
        }
        this.setState({ img, previewImg });
    }

    handleChangeName = (e) => {
        this.setState({ name: e.target.value });
    }

    handleChangeBrand = (data) => {
        this.setState({ brand: data.value });
    }

    handleChangeCategories = (data) => {
        if (data) {
            let categories = [];
            for (let index = 0; index < data.length; index++) {
                categories.push(data[index].value);
            }

            this.setState({ categories });
        }
    }

    handleChangeColor = (data) => {
        if (data) {
            let colors = [];
            for (let index = 0; index < data.length; index++) {
                colors.push(data[index].value);
            }

            this.setState({ colors });
        }
    }

    handleChangeDescription = (e) => {
        this.setState({ description: e.target.value });

    }

    handleChangePrice = (e) => {
        this.setState({ price: e.target.value });

    }

    handleChangeQuantity = (e) => {
        this.setState({ quantity: e.target.value });

    }

    handleChangeSize = (data) => {
        if (data) {
            let sizes = [];
            for (let index = 0; index < data.length; index++) {
                sizes.push(data[index].value);
            }
            console.log('>>>' + sizes);
            this.setState({ sizes });
        }
    }

    handleComplete = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', this.props.cloth._id);
        formData.append('name', this.state.name);
        formData.append('brand', this.state.brand);
        formData.append('description', this.state.description);
        formData.append('price', this.state.price);
        formData.append('quantity', this.state.quantity);
        for (let index = 0; index < this.state.colors.length; index++) {
            const element = this.state.colors[index];
            formData.append('colors', element);
        }
        for (let index = 0; index < this.state.sizes.length; index++) {
            const element = this.state.sizes[index];
            formData.append('sizes', element);
        }
        for (let index = 0; index < this.state.categories.length; index++) {
            const element = this.state.categories[index];
            formData.append('categories', element);
        }
        for (let index = 0; index < this.state.img.length; index++) {
            const element = this.state.img[index];
            formData.append('img', element);
        }

        this.props.editProduct(formData);
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.history.push('/admin');
    }

    render() {
        return (
            <form className="add-product-page">
                <div className="wrapped-label">
                    <Label title="PHOTOS" className="title-label" />
                </div>
                <PreviewImage img={this.state.previewImg} imgChange={this.handleImgChange} />
                <TextField title='NAME' classNameInput="input-name-field" classNameLabel="title-label" wrappedLabel="wrapped-label" placeholder='Enter name of product' name="name" value={this.state.name} onChange={e => this.handleChangeName(e)} />
                <div className="wrapped-label">
                    <Label title="CATEGORIES" className="title-label" />
                </div>
                {
                    this.state.optionCategories.length != 0 && this.state.categoriesValue.length != 0 ? <MultiSelectBox onChange={this.handleChangeCategories} options={this.state.optionCategories} defaultValue={this.state.categoriesValue} className="wrapped-selectpage" classNameSelect="select-multi" />
                        : null

                }
                <div className="wrapped-label">
                    <Label title="BRAND" className="title-label" />
                </div>
                {
                    this.state.brandValue ? <SelectBox onChange={this.handleChangeBrand} defaultValue={this.state.brandValue} options={Option.optionsBrand} className="wrapped-selectpage" classNameSelect="select-page" />
                        : null
                }
                <TextField title='PRICE' classNameInput="input-price-field" classNameLabel="title-label" wrappedLabel="wrapped-label" placeholder='Enter price of product' name="price" value={this.state.price} onChange={e => this.handleChangePrice(e)} />
                <div className="wrapped-label">
                    <Label title="SIZE" className="title-label" />
                </div>
                {
                    this.state.sizeValue.length != 0 ?  <MultiSelectBox onChange={this.handleChangeSize} defaultValue={this.state.sizeValue} options={Option.optionsSize} className="wrapped-selectpage" classNameSelect="select-multi" />
                        : null
                }
                <div className="wrapped-label">
                    <Label title="COLORS" className="title-label" />
                </div>
                {
                    this.state.colorValue.length != 0 ? <MultiSelectBox onChange={this.handleChangeColor} defaultValue={this.state.colorValue} options={Option.optionsColor} className="wrapped-selectpage" classNameSelect="select-multi" />
                        : null
                }

                <TextField title='QUANTITY' classNameInput="input-quantity-field" classNameLabel="title-label" wrappedLabel="wrapped-label" placeholder='Enter quantity of product' name="quantity" value={this.state.quantity} onChange={e => this.handleChangeQuantity(e)} />
                <TextField title='DESCRIPTION' classNameInput="input-description-field" classNameLabel="title-label" wrappedLabel="wrapped-label" placeholder='Enter description of product' name="description" value={this.state.description} onChange={e => this.handleChangeDescription(e)} />

                <div className="grouped-bttn">
                    <Button onButtonClick={this.handleCancel} className="cancel-bttn" title="Cancel" />
                    <Button onButtonClick={this.handleComplete} className="complete-bttn" title="Complete" type="submit" />
                </div>
            </form>
        )
    }
}

const mapStateToProps = state => {
    return {
        cloth: state.clothesReducer.cloth,
        categories: state.categoriesReducer.categories,
        clothAfterEdit: state.adminReducer.cloth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getClothesWithId: id =>{
            dispatch(getClothesWithIdRequest(id));
        },
        setTitlePage: title => {
            dispatch(setTitlePageAdmin(title));
        },
        getAllCategories: () => {
            dispatch(getAllCategoriesRequest());
        },
        editProduct: (product) => {
            dispatch(editProductRequest(product));
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminEditProduct));