import React, { useState } from "react";
import Input from "@/components/components/Input";
import { CirclePicker } from "react-color";
import Button from "@/components/components/Button";
import { Color } from "@/enum";
import { useSession } from "next-auth/react";
import axios from "axios";
import ModalComponent from "../Modal";
import { Goal, GoalInput } from "@/goal";
import CurrencyInput from "@/components/components/CurrencyInput";
import DatePicker from "@/components/components/DatePicker";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onGoalAdded: (newGoal: Goal) => void;
};

const InsertGoalModal: React.FC<Props> = ({ isOpen, onClose, onGoalAdded }) => {
    const [data, setData] = useState<GoalInput>({
        name: "",
        color: Color.ORANGE,
        currentGoalValue: "",
        finalGoalValue: "",
        finalGoalDate: "",
        userId: ""
    });

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorName, setColorName] = useState("ORANGE");

    const { data: session } = useSession();

    const handleSubmit = async () => {
        if (!session) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const userId = session?.user?.userId;

            const responseGoal = await axios.post(`/api/goals/`, {
                ...data,
                userId: userId,
                currentGoalValue: parseFloat(data.currentGoalValue || "0"),
                finalGoalValue: parseFloat(data.finalGoalValue || "0"),
            });
            const createdGoal = responseGoal.data;

            if (createdGoal.error) {
                console.error(createdGoal.error);
            } else {
                const finance = {
                    name: createdGoal.name,
                    value: createdGoal.currentGoalValue,
                    type: 'EXPENSE',
                    userId: userId,
                    date: new Date(),
                    // categoryId: /* ID da categoria apropriada */,
                    goalId: createdGoal.id,
                };
                await axios.post(`/api/finances/`, finance);

                onGoalAdded(createdGoal);
                onClose();
            }
        } catch (error) {
            console.error("Failed to add goal");
        }
    };

    const getColorName = (hexCode: string): string => {
        const colorName = Object.keys(Color).find(
            (color) => Color[color as keyof typeof Color] === hexCode
        );
        return colorName ?? "";
    };

    const handleColorChange = (color: any) => {
        setData({ ...data, color: getColorName(color.hex) });
        setShowColorPicker(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            modalTitle="Adicionar Meta"
            actionButton={
                <Button
                    className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
                    onClick={handleSubmit}
                >
                    Adicionar
                </Button>
            }
        >
            <div className="flex flex-col gap-3 w-full">
                <Input
                    placeholder="Nome da Meta"
                    className="w-full"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                />

                <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6">
                        <CurrencyInput
                            placeholder="Valor Inicial R$"
                            className="w-full"
                            name="initialGoalValue"
                            value={data.currentGoalValue}
                            onValueChange={(value) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    currentGoalValue: value,
                                }))
                            }
                        />
                    </div>

                    <div className="col-span-6">
                        <CurrencyInput
                            placeholder="Valor Final R$"
                            className="w-full"
                            name="finalGoalValue"
                            value={data.finalGoalValue}
                            onValueChange={(value) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    finalGoalValue: value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-7">
                        <DatePicker
                            className="w-full"
                            selected={data.finalGoalDate}
                            onChange={(date) =>
                                setData((prevData) => ({
                                    ...prevData,
                                    finalGoalDate: date as Date,
                                }))
                            }
                            placeholderText="Data Final"
                        />
                    </div>

                    <div className="col-span-5 flex flex-col gap-3">
                        <Button
                            className="bg-white text-textGray w-full flex items-center gap-3 hover:bg-textGray hover:text-white"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            <span
                                className="w-8 h-8 rounded-full ml-3 border border-textGray"
                                style={{
                                    backgroundColor:
                                        Color[data.color as keyof typeof Color],
                                }}
                            ></span>
                            Selecione sua Cor
                        </Button>

                        {showColorPicker && (
                            <div className="w-full mx-auto p-3 bg-white border border-primaryOrange rounded-lg">
                                <CirclePicker
                                    colors={Object.values(Color)}
                                    onChange={handleColorChange}
                                    circleSize={25}
                                    circleSpacing={6}
                                    className="mx-auto max-w-fit circle-picker"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ModalComponent>
    );
};

export default InsertGoalModal;
