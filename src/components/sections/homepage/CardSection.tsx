"use client";

import Card from "@/components/components/Card";
import React from "react";

import { MdTrendingUp, MdTrendingDown, MdAttachMoney } from "react-icons/md";

const CardSection = () => {
    return (
        <div className="container flex flex-wrap gap-5">
            <Card title='Entradas' value='10.000,00' Icon={MdTrendingUp}/>
            <Card title='Despesas' value='1.000,00'Icon={MdTrendingDown}/>
            <Card title='Total' value='9.000,00' Icon={MdAttachMoney}/>
        </div>
    );
}

export default CardSection;