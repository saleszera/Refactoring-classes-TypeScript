import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { Food as FoodData } from '../../types/food';
import { FoodsContainer } from './styles';

import api from '../../services/api';

export function Dashboard(){
  const [foods, setFoods] = useState<FoodData[]>({} as FoodData[]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('foods')
      .then(response => setFoods(response.data));
  }, []);

  const handleAddFood = async (food: FoodData) => {
    
    try {
      const response = await api.post<FoodData>('/foods', {
        ...food,
        available: true,
      });      

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodData) => {    

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {   

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  }

  const handleEditFood = (food: FoodData) => {    
    setEditingFood(food);
    setIsEditModalOpen(true);
  } 

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">              
        {foods.length >= 0 &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}