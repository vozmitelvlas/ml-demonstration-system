#!/bin/bash

# Запуск первого скрипта: генерация модели TinyConv
echo "Запуск generate_model_tinycov.py..."
python3 generate_model_tinycov.py

# Запуск второго скрипта: генерация модели U-Net
echo "Запуск generate_model_unet.py..."
python3 generate_model_unet.py

# Запуск третьего скрипта: генерация модели Wav2Vec2
echo "Запуск generate_model_wav2vec.py..."
python3 generate_model_wav2vec_noquant.py

echo "Все три модели успешно обработаны."