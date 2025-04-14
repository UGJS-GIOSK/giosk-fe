import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('members');
  const navigate = useNavigate();

  const fetchOrders = async endpoint => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/payments/${endpoint}`,
        { withCredentials: true },
      );
      setOrders(res.data.data ?? []);
    } catch (err) {
      console.error('결제 내역 불러오기 실패:', err);
      setOrders([]);
    }
  };

  const cancelPayment = async paymentKey => {
    const payload = { paymentKey };
    const config = { withCredentials: true };

    // ✅ 콘솔로 확인
    console.log('🚀 환불 요청 payload:', payload);
    console.log('📦 요청 config:', config);

    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/admin/payments',
        payload,
        config,
      );
      console.log('✅ 환불 응답:', res.data);
      alert('환불 요청 성공');
      fetchOrders(filter); // 목록 다시 불러오기
    } catch (err) {
      console.error('❌ 환불 실패:', err);
      alert('환불 실패: ' + (err.response?.data?.message || '에러 발생'));
    }
  };

  useEffect(() => {
    fetchOrders(filter);
  }, [filter]);

  return (
    <div className="relative p-6 bg-[#f0eade] min-h-screen font-['Pretendard']">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-[#165a4a] text-white rounded-xl hover:bg-[#104036] font-bold"
        >
          뒤로가기
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#165a4a] mb-4">주문 내역</h1>

      {/* 필터 버튼 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('members')}
          className={`px-4 py-2 rounded-xl font-semibold ${
            filter === 'members'
              ? 'bg-[#165a4a] text-white'
              : 'bg-white text-[#165a4a] border border-[#165a4a]'
          }`}
        >
          회원 주문 조회
        </button>
        <button
          onClick={() => setFilter('non-members')}
          className={`px-4 py-2 rounded-xl font-semibold ${
            filter === 'non-members'
              ? 'bg-[#165a4a] text-white'
              : 'bg-white text-[#165a4a] border border-[#165a4a]'
          }`}
        >
          비회원 주문 조회
        </button>
      </div>

      {/* 테이블 */}
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead className="bg-[#165a4a] text-white text-left font-medium">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">결제키</th>
            <th className="p-3">상태</th>
            <th className="p-3">요청시간</th>
            <th className="p-3">승인시간</th>
            <th className="p-3">총액</th>
            <th className="p-3">상세</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.paymentKey}</td>
              <td className="p-3">{order.status}</td>
              <td className="p-3">{order.requestedAt}</td>
              <td className="p-3">{order.approvedAt}</td>
              <td className="p-3">{order.totalAmount.toLocaleString()}원</td>
              <td className="p-3">
                <button
                  onClick={() =>
                    setExpandedId(prev => (prev === order.id ? null : order.id))
                  }
                  className="text-[#165a4a] hover:underline"
                >
                  {expandedId === order.id ? '닫기' : '보기'}
                </button>
              </td>
            </tr>
          ))}

          {/* 상세 펼침 + 환불 버튼 */}
          {orders.map(order => {
            const response =
              order.memberOrderResponse || order.nonMemberOrderResponse;

            return (
              expandedId === order.id && (
                <tr key={`${order.id}-details`} className="bg-[#f9f6f1]">
                  <td colSpan={7} className="p-4">
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>포장 여부:</strong>{' '}
                        {response?.takeout ? '포장' : '매장'}
                      </p>
                      <p>
                        <strong>적립 여부:</strong>{' '}
                        {response?.stamp ? '예' : '아니오'}
                      </p>
                      <p>
                        <strong>쿠폰 사용:</strong>{' '}
                        {response?.coupon ? '예' : '아니오'}
                      </p>
                      <p>
                        <strong>주문 시간:</strong> {response?.orderedAt}
                      </p>

                      {response?.memberResponse ? (
                        <p>
                          <strong>회원:</strong>{' '}
                          {response.memberResponse.phoneNumber} (
                          {response.memberResponse.stamp} 스탬프 /{' '}
                          {response.memberResponse.coupon} 쿠폰)
                        </p>
                      ) : (
                        <p>
                          <strong>회원:</strong> 비회원
                        </p>
                      )}

                      {/* 주문 상품 정보 */}
                      <div className="mt-3">
                        <strong>주문 상품:</strong>
                        <div className="mt-1 space-y-1">
                          {response?.orderProductResponses?.map((item, idx) => (
                            <div
                              key={idx}
                              className="pl-4 text-gray-600 text-sm"
                            >
                              <p className="font-medium text-gray-800">
                                • {item.productResponse.name} x{item.quantity}
                              </p>
                              {item.orderProductOptionResponses.map(
                                (opt, i) => (
                                  <p key={i} className="ml-4">
                                    - 옵션: {opt.optionResponse.option_name} (
                                    {opt.optionResponse.option_price > 0
                                      ? `+${opt.optionResponse.option_price.toLocaleString()}원`
                                      : '무료'}
                                    )
                                  </p>
                                ),
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 환불 버튼 */}
                      {order.status === 'DONE' && (
                        <div className="mt-4">
                          <button
                            onClick={() => cancelPayment(order.paymentKey)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            환불하기
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
