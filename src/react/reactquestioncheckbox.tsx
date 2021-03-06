﻿import * as React from 'react';
import {ReactSurveyElement, SurveyQuestionElementBase} from "./reactquestionelement";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import {QuestionCheckboxModel} from "../question_checkbox";
import {ItemValue} from "../itemvalue";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionCheckbox extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        }
    }
    protected get question(): QuestionCheckboxModel { return this.questionBase as QuestionCheckboxModel; }
    render(): JSX.Element {
        if (!this.question) return null;
        var cssClasses = this.question.cssClasses;
        return (
            <div className={cssClasses.root}>
                {this.getItems(cssClasses) }
            </div>);
    }
    protected getItems(cssClasses: any): Array<any> {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item, i == 0, cssClasses));
        }
        return items;
    }
    protected get textStyle(): any { return null; }
    protected renderItem(key: string, item: any, isFirst: boolean, cssClasses: any): JSX.Element {
        return <SurveyQuestionCheckboxItem key={key} question={this.question} cssClasses={cssClasses} isDisplayMode={this.isDisplayMode} item={item} textStyle={this.textStyle} isFirst={isFirst} />;
    }
}
export class SurveyQuestionCheckboxItem extends ReactSurveyElement {
    protected question: QuestionCheckboxModel;
    protected item: ItemValue;
    protected textStyle: any;
    protected isFirst: any;
    constructor(props: any) {
        super(props);
        this.item = props.item;
        this.question = props.question;
        this.textStyle = props.textStyle;
        this.isFirst = props.isFirst;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    public shouldComponentUpdate(): boolean {
        return !this.question.customWidget || !!this.question.customWidgetData.isNeedRender || !!this.question.customWidget.widgetJson.render;
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.item = nextProps.item;
        this.textStyle = nextProps.textStyle;
        this.question = nextProps.question;
        this.isFirst = nextProps.isFirst;
    }
    handleOnChange(event) {
        var newValue = this.question.value;
        if (!newValue) {
            newValue = [];
        }
        var index = newValue.indexOf(this.item.value);
        if (event.target.checked) {
            if (index < 0) {
                newValue.push(this.item.value);
            }
        } else {
            if (index > -1) {
                newValue.splice(index, 1);
            }
        }
        this.question.value = newValue;
        this.setState({ value: this.question.value });
    }
    render(): JSX.Element {
        if (!this.item || !this.question) return null;
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight, display: 'inline-block' };
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = (this.question.value && this.question.value.indexOf(this.item.value) > -1) || false;
        var otherItem = (this.item.value === this.question.otherItem.value && isChecked) ? this.renderOther() : null;
        return this.renderCheckbox(isChecked, divStyle, otherItem);
    }
    protected get inputStyle(): any { return { marginRight: "3px" }; }
    protected renderCheckbox(isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element {
        var id = this.isFirst ? this.question.inputId : null;
        var text = this.renderLocString(this.item.locText);
        return (
            <div className={this.cssClasses.item} style={divStyle}>
                <label className={this.cssClasses.label}>
                    <input type="checkbox" value={this.item.value} id={id} style={this.inputStyle} disabled={this.isDisplayMode} checked={isChecked} onChange={this.handleOnChange} />
                    <span className="checkbox-material" style={{"marginRight": "5px"}}><span className="check"></span></span>
                    <span>{text}</span>
                </label>
                {otherItem}
            </div>
        );
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.cssClasses.other}><SurveyQuestionCommentItem  question={this.question} otherCss={this.cssClasses.other} cssClasses={this.cssClasses} isDisplayMode={this.isDisplayMode}/></div>);
    }
}

ReactQuestionFactory.Instance.registerQuestion("checkbox", (props) => {
    return React.createElement(SurveyQuestionCheckbox, props);
});
