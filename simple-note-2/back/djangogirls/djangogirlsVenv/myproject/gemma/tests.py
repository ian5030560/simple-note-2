from django.test import TestCase

# Create your tests here.


# from transformers import BertTokenizer, GPT2LMHeadModel, TextGenerationPipeline

# # 加載分詞器和模型
# tokenizer = BertTokenizer.from_pretrained("uer/gpt2-distil-chinese-cluecorpussmall")
# model = GPT2LMHeadModel.from_pretrained("uer/gpt2-distil-chinese-cluecorpussmall")

# # 創建文本生成管道
# text_generator = TextGenerationPipeline(
#     model, 
#     tokenizer, 
#     device=0, 
#     truncation=True,  # 明確設定截斷
#     clean_up_tokenization_spaces=True  # 設置是否清理空格
# )

# # 用改善的設置生成文本
# output = text_generator(
#     "作業系統是電腦最基本的",  # 輸入文本
#     max_new_tokens=10,  # 減小最大長度
#     do_sample=True,  # 啟用採樣以增加多樣性
#     repetition_penalty=1.5,  # 增大重複懲罰
#     temperature=0.8,  # 降低溫度以獲得更集中的結果
#     top_k=50,  # 限制前50個最有可能的詞
#     top_p=0.95  # 使用核採樣，增強多樣性
# )

# # 輸出結果
# print(output)

# 加載數據集
from datasets import load_dataset
# dataset = load_dataset("Heng666/Traditional_Chinese-aya_collection", "aya_dataset")
dataset = load_dataset("lchakkei/OpenOrca-Traditional-Chinese")
print(dataset["train"][0])  # 查看第0個樣本


# 加載 GPT-2 分詞器與模型
from transformers import BertTokenizer, GPT2LMHeadModel, GPT2Tokenizer

# 我們使用預訓練好的 GPT-2 模型和分詞器進行微調
tokenizer = BertTokenizer.from_pretrained("uer/gpt2-distil-chinese-cluecorpussmall")
model = GPT2LMHeadModel.from_pretrained("uer/gpt2-distil-chinese-cluecorpussmall")

# 定義一個用於分詞的函數，同時處理 question 和 response
def tokenize_function(examples):
    # 分詞 'question'
    question = tokenizer(examples["question"], truncation=True, padding="max_length", max_length=128)
    # 分詞 'response'
    response = tokenizer(examples["response"], truncation=True, padding="max_length", max_length=128)

    # 將 question 和 response 的結果合併，作為輸出返回
    return {
        "input_ids": question["input_ids"],    # question 的 token ids
        "attention_mask": question["attention_mask"],  # question 的注意力掩碼
        "labels": response["input_ids"]  # 使用 response 的 token ids 作為標籤
    }


# 使用 map 函數對整個數據集進行 tokenization
tokenized_datasets = dataset.map(tokenize_function, batched=True)

# 設置訓練參數
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",           # 輸出目錄，儲存模型和結果
    overwrite_output_dir=True,        # 如果目錄存在，允許覆蓋
    num_train_epochs=3,               # 訓練的輪數，3 輪訓練
    per_device_train_batch_size=4,    # 每個設備（例如 GPU）的批次大小
    save_steps=10_000,                # 每訓練 10,000 步保存一次模型
    save_total_limit=2,               # 最多保存 2 個模型檔案
    logging_dir="./logs",             # 日誌存放的目錄
)

# 定義 Trainer，這是 Hugging Face 用於簡化模型訓練的工具
trainer = Trainer(
    model=model,                      # 要訓練的模型
    args=training_args,               # 訓練參數
    train_dataset=tokenized_datasets["train"],  # 訓練數據集
)

# 開始訓練模型
trainer.train()

# 訓練完成後保存模型和分詞器
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")

# 測試模型的文本生成功能
from transformers import TextGenerationPipeline
from transformers import BertTokenizer, GPT2LMHeadModel, GPT2Tokenizer

# 加載微調後的模型與分詞器
fine_tuned_model = GPT2LMHeadModel.from_pretrained("./fine_tuned_model")
fine_tuned_tokenizer = BertTokenizer.from_pretrained("./fine_tuned_model")

# 創建文本生成的管道，方便直接生成文本
text_generator = TextGenerationPipeline(fine_tuned_model, fine_tuned_tokenizer, device=0)

output = text_generator(
    "請問“問題：孔子在哪裡出生？",  # 輸入文本
    max_new_tokens=100,  # 減小最大長度
    do_sample=True,  # 啟用採樣以增加多樣性
    repetition_penalty=1.5,  # 增大重複懲罰
    temperature=0.8,  # 降低溫度以獲得更集中的結果
    top_k=50,  # 限制前50個最有可能的詞
    top_p=0.95  # 使用核採樣，增強多樣性
)

# 輸出結果
print(output)