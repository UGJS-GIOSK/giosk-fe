// src/components/ProductIngredient.jsx

export default function ProductIngredient({ detailInfo, onClose }) {
  if (!detailInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl">
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">성분 상세 정보</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            <strong>칼로리:</strong> {detailInfo.calories} kcal
          </li>
          <li>
            <strong>카페인:</strong> {detailInfo.caffeineMg} mg
          </li>
          <li>
            <strong>나트륨:</strong> {detailInfo.sodiumMg} mg
          </li>
          <li>
            <strong>당류:</strong> {detailInfo.sugarG} g
          </li>
          <li>
            <strong>단백질:</strong> {detailInfo.proteinG} g
          </li>
          <li>
            <strong>포화지방:</strong> {detailInfo.saturatedFatG} g
          </li>
          <li>
            <strong>용량:</strong> {detailInfo.volumeMl} ml
          </li>
          <li>
            <strong>알러지 정보:</strong> {detailInfo.allergens}
          </li>
        </ul>
      </div>
    </div>
  );
}
